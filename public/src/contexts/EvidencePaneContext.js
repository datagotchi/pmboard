import React, { createContext } from "react";

import { EvidencePaneProps } from "../types";

// TODO: pass panes in because contexts seem like overkill

/**
 * @type {React.Context<React.FC<EvidencePaneProps>>}
 */
export const EvidencePaneContext = createContext();
