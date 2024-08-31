import React, { createContext } from "react";
import { WithContext as ReactTags } from "react-tag-input";

/**
 * @type {React.Context<ReactTags.Tag[] | undefined>}
 */
export const AllTagsContext = createContext();
