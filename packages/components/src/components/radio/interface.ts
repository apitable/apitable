import React from 'react';

export interface IRadio {
  /** 
   * Child elements
   */
  children?: React.ReactNode;
  /**
   * Radio name
   */
  name?: string;
  /**
   * Whether checked or unchecked
   */
  checked?: boolean,
  /**
   * Change Event
   */
  onChange?: (e: React.ChangeEvent) => void,
  /**
   * readonly
   */
  readOnly?: boolean,
  /**
   * Value
   */
  value?: any,
  /**
   * Whether disabled or not
   */
  disabled?: boolean;
  /**
   * Whether use button style or not
   */
  isBtn?: boolean;
}

export interface IRadioGroupContext {
  onChange?: (e: React.ChangeEvent) => void;
  value?: any;
  disabled?: boolean;
  name?: string;
  isBtn?: boolean;
}