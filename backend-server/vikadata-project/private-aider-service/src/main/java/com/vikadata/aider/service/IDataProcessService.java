package com.vikadata.aider.service;

/**
 * <p>
 *  Service Interface: Data Processor
 * </p>
 */
public interface IDataProcessService {

    /**
     * control data migration
     */
    void controlProcess();

    /**
     * Fix: during 211202 - 220124，when referring templates or import multiple sheet excel,
     * the problem is data about child file's creator is null.
     */
    void nodeCreated();

    /**
     * Mirror widget support: processing data which needed.
     */
    void mirrorWidget();
}
