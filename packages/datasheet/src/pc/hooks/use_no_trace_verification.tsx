/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { useMount } from 'ahooks';
import React, { useCallback, useId, useRef, useState } from 'react';
import { initNoTraceVerification, needNoTraceVerification } from 'pc/utils/no_trace_verification';

export interface IUseNoTraceVerificationOptions {
  /** 
   * Callback function executed after successful verification (optional, can also be passed in executeWithVerification)
   * @param nvcData Data returned after successful verification
   */
  onSuccess?: (nvcData?: string) => void;
  /**
   * Whether to automatically re-initialize captcha after successful verification.
   * Set to false if you need to reuse nvcData within the same business flow without re-triggering verification.
   * @default true
   */
  autoReinitialize?: boolean;
  /**
   * Whether to enable no-trace verification.
   * Set to false to skip initialization and verification entirely.
   * Useful for conditional verification scenarios.
   * @default true
   */
  enabled?: boolean;
}

export interface IUseNoTraceVerificationReturn {
  /** Whether no-trace verification is required */
  needVerify: boolean;
  /** 
   * Data returned after successful verification.
   * Can be reused within the same business flow when autoReinitialize is false.
   */
  nvcData: string | null;
  /** Clear verification data manually */
  clearNvcData: () => void;
  /** 
   * Execute operation with verification
   * @param beforeCheck Pre-check function for business validation, returns false to stop execution
   * @param callback Callback executed after verification passes, receives nvcData
   */
  executeWithVerification: (beforeCheck?: () => boolean, callback?: (nvcData?: string) => void) => void;
  /** 
   * Trigger verification popup (only used when verification is needed but no verification data exists)
   */
  triggerVerification: () => void;
  /** 
   * DOM element required for rendering captcha
   * This element needs to be rendered in the component
   */
  CaptchaElement: React.FC;
}

/**
 * No-trace Verification Hook
 * 
 * Usage:
 * ```tsx
 * const { needVerify, executeWithVerification, CaptchaElement } = useNoTraceVerification({
 *   onSuccess: (nvcData) => {
 *     // Operation to execute automatically after successful verification
 *     sendRequest(nvcData);
 *   }
 * });
 * 
 * const handleClick = () => {
 *   executeWithVerification(
 *     () => checkAccount(), // Pre-check validation
 *     (nvcData) => sendRequest(nvcData) // Execute after verification passes
 *   );
 * };
 * 
 * return (
 *   <div>
 *     <button onClick={handleClick}>Submit</button>
 *     <CaptchaElement />
 *   </div>
 * );
 * ```
 */
export const useNoTraceVerification = (
  options: IUseNoTraceVerificationOptions = {}
): IUseNoTraceVerificationReturn => {
  const { onSuccess, autoReinitialize = true, enabled = true } = options;
  
  const [nvcData, setNvcData] = useState<string | null>(null);
  const needVerify = enabled && needNoTraceVerification();
  
  // Store pending callback function
  const pendingCallbackRef = useRef<((_data?: string) => void) | null>(null);
  
  // Store latest onSuccess callback to avoid stale closure
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  
  // Generate unique ID to avoid conflicts between multiple instances
  const uniqueId = useId().replace(/:/g, '-');
  const captchaElementId = `captcha-element-${uniqueId}`;
  const captchaButtonId = `captcha-button-${uniqueId}`;

  const initCaptcha = () => {
    if (!needVerify) return;
    
    initNoTraceVerification((data?: string) => {
      setNvcData(data || null);
      // Execute pending callback
      if (pendingCallbackRef.current) {
        pendingCallbackRef.current(data);
        pendingCallbackRef.current = null;
      }
      // Use ref to get latest onSuccess callback
      onSuccessRef.current?.(data);
      // Re-initialize captcha for next use
      if (autoReinitialize) {
        setNvcData(null);
        initCaptcha();
      }
    }, captchaElementId, captchaButtonId);
  };
  
  useMount(() => {
    initCaptcha();
  });       
  
  const clearNvcData = useCallback(() => {
    setNvcData(null);
  }, []);
  
  const triggerVerification = useCallback(() => {
    const btn = document.getElementById(captchaButtonId);
    if (btn) {
      btn.click();
    }
  }, [captchaButtonId]);
  
  const executeWithVerification = useCallback((
    beforeCheck?: () => boolean,
    callback?: (nvcData?: string) => void
  ) => {
    // 1. Execute business validation first
    if (beforeCheck && !beforeCheck()) return;
    
    // Determine the actual callback to execute
    // Priority: callback parameter > onSuccess option (use ref to get latest)
    const actualCallback = callback || onSuccessRef.current;
    
    // 2. Check if no-trace verification is required
    if (!needVerify) {
      // No verification needed, execute callback directly
      actualCallback?.(undefined);
      return;
    }
    
    // 3. Check if verification result already exists (for scenarios where nvcData is reused within the same business flow)
    if (nvcData) {
      // Verification result exists, execute callback directly without triggering new verification
      actualCallback?.(nvcData);
      return;
    }
    
    // 4. Store callback and trigger no-trace verification
    pendingCallbackRef.current = callback || null;
    triggerVerification();
  }, [needVerify, nvcData, triggerVerification]);
  
  // Captcha rendering component
  const CaptchaElement: React.FC = useCallback(() => {
    if (!needVerify) return null;
    
    return (
      <>
        <div id={captchaElementId} />
        <button id={captchaButtonId} style={{ display: 'none' }} type="button" />
      </>
    );
  }, [needVerify, captchaElementId, captchaButtonId]);
  
  return {
    needVerify,
    nvcData,
    clearNvcData,
    executeWithVerification,
    triggerVerification,
    CaptchaElement,
  };
};
