package com.vikadata.api.modular.workspace.observer;

/**
 * <p>
 *
 * </p>
 *
 * @author Pengap
 * @date 2021/10/9 11:38:21
 */
public interface DatasheetObservable {

    void registerObserver(DatasheetObserver o);

    void removeObserver(DatasheetObserver o);

    void notifyObserver();

}
