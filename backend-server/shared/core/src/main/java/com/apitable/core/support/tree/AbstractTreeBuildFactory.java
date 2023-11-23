/*
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

package com.apitable.core.support.tree;

import java.util.List;

/**
 * <p>
 *  the tree builder's abstract class, defined the base step of building tree.
 * </p>
 */
public abstract class AbstractTreeBuildFactory<T> {

    /**
     * the process of building the tree.
     *
     * @param nodes the list of nodes
     * @return List
     */
    public List<T> doTreeBuild(List<T> nodes) {

        // the node processing work before building tree
        List<T> readyToBuild = beforeBuild(nodes);

        // the main process of building tree
        List<T> buildProcess = executeBuilding(readyToBuild);

        // the post of processing step
        return afterBuild(buildProcess);
    }

    /**
     * Processing before the build.
     *
     * @param nodes the list of nodes
     * @return List
     */
    protected abstract List<T> beforeBuild(List<T> nodes);

    /**
     * the build process.
     *
     * @param nodes the list of nodes
     * @return List
     */
    protected abstract List<T> executeBuilding(List<T> nodes);

    /**
     * processing after the build.
     *
     * @param nodes the list of nodes
     * @return List
     */
    protected abstract List<T> afterBuild(List<T> nodes);
}
