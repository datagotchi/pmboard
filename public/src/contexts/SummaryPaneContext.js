import React, { createContext } from "react";

import { SummaryPaneProps } from "../types";

/**
 * @type {React.Context<React.FC<SummaryPaneProps>>}
 */
export const SummaryPaneContext = createContext();
