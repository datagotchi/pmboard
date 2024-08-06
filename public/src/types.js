/**
 * @typedef Product
 * @property {string} name The name of the product
 */

/**
 * @typedef WidgetDataItem
 * @property {string} name The name of the item
 * @property {EvidenceFile[]} evidence The documents with evidence
 */

/**
 * @typedef EvidenceTrend
 * @property {string} name
 * @property {string} type
 */

/**
 * @typedef EvidenceFile
 * @property {string} name
 * @property {string} url
 * @property {any} icon
 * @property {EvidenceTrend[]} trends
 */

/**
 * @typedef GoogleFile
 * @property {string} title,
 * @property {string} alternateLink
 * @property {string} iconLink
 */

// TODO: figure out inheritence
/**
 * @typedef Persona
 * @property {string} name The name of the persona
 * @property {EvidenceFile[]} evidence The documents with evidence
 */

module.exports = {};
