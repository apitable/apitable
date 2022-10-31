package com.vikadata.api.modular.workspace.observer;

public interface DatasheetObservable {

    void registerObserver(DatasheetObserver o);

    void removeObserver(DatasheetObserver o);

    void notifyObserver();

}
