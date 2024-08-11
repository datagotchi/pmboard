// eslint-disable-next-line no-unused-vars
import React from "react";
// eslint-disable-next-line no-unused-vars
import { WithContext as ReactTags } from "react-tag-input";

/**
 * @typedef Product
 * @property {string} name The name of the product
 */

/**
 * @typedef EvidenceTrend
 * @property {string} name The name of the trend.
 * @property {string} type The type of the trend.
 */

/**
 * @typedef EvidenceRecord
 * @property {string} name The name of the evidence record.
 * @property {string} createdDate The date it was created.
 * @property {string} modifiedDate The date it was last modified.
 * @property {EvidenceTrend[]} trends The trends found in the evidence.
 */

/**
 * @typedef EvidenceFile
 * @property {string} name The name of the file.
 * @property {string} url The url of the file.
 * @property {any} icon The icon of the file.
 * @property {string} createdDate The date it was created.
 * @property {string} modifiedDate The date it was last modified.
 * @property {EvidenceTrend[]} trends The trends found in the file.
 */

/**
 * @typedef GoogleFile
 * @property {string} title The title of the file.
 * @property {string} alternateLink The url of the file.
 * @property {string} iconLink The icon of the file.
 */

/**
 * @typedef WidgetDataItem
 * @property {string} name The name of the item
 * @property {EvidenceRecord[]} evidence The objects that act as evidence
 */

/**
 * @typedef Persona
 * @property {string} name The name of the persona
 * @property {EvidenceFile[]} evidence The files that act as evidence
 */

/**
 * @typedef Company
 * @property {string} name The name of the company
 * @property {EvidenceFile[]} evidence The files that act as evidence
 */

/**
 * @typedef Story
 * @property {string} name The name of the user story
 * @property {EvidenceFile[]} evidence The files that act as evidence
 */

/**
 * @typedef Task
 * @property {string} name The name of task
 * @property {EvidenceFile[]} evidence The files that act as evidence
 */

/**
 * @typedef EvidenceAPI
 * @property {(itemIndex: number, evidence: EvidenceRecord[]) => Promise<Response>} updateEvidence The function to call to update a widget item's evidence.
 * @property {(itemIndex: number, evidenceIndex: number, trends: EvidenceTrend[]) => Promise<Response>} updateTrends The function to call to update an evidence object's trends.
 */

/**
 * @typedef BaseCollectionAPI
 * @property {(item: WidgetDataItem) => Promise<Response>} addItem The function to call to add a widget item to the server.
 * @property {(item: WidgetDataItem, index: number) => Promise<Response>} updateItem The function to call to update a widget item on the server.
 * @property {(index: number) => Promise<Response>} deleteItem The function to call to delete a widget item from the server.
 */

/**
 * @typedef {BaseCollectionAPI & EvidenceAPI} CollectionAPI
 */

/**
 * @typedef EvidencePaneProps
 * @property {string} productId The ID of the currnent product.
 * @property {EvidenceRecord[]} evidence The evidence to show in the pane.
 * @property {string} containerModalId The ID of the containing modal dialog.
 * @property {(evidence: EvidenceRecord[]) => Promise<Response>} updateEvidenceOnServer The function to call when the evidence collection changes.
 * @property {(tags: ReactTags.Tag[]) => void} tagsUpdatedFunc The function to call when tags are updated in the evidence pane.
 */

/**
 * @typedef {{[key: string]: ReactTags.Tag[]}} TagsPerEvidenceRecord
 */
