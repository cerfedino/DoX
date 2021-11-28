const path = require("path");
const fs = require("fs-extra");

module.exports= {
    flags : {
        missing_object: [],
        missing_file: [],
        object_file_ok: []
    },
    /**
     * Syncs up the database and the document files.
     * @param {Collection<Document>} db_docs the document collection.
     * @param {string} docs_folder the documents folder.
     * @returns {Promise<obj>} resolves with the synced up flags.
     */
    check_docs : (db_docs, docs_folder) => {
        return new Promise (async (resolve, reject) => {
            var ret = {
                missing_object: [],
                missing_file: [],
                object_file_ok: []
            }


            // Structure of the documents folder
            // docs_folder/
            //    doc_id/
            //       doc_id.js
            //       resources/

            // TODO: Agree on common project structure.

            for (const dir of fs.readdirSync(docs_folder)) {
                if (!fs.lstatSync(dir).isDirectory())
                    continue;

                const doc_id = dir
            }
            //


            module.exports.flags.missing_object = ret.missing_object || []
            module.exports.flags.missing_file = ret.missing_file || []
            module.exports.flags.object_file_ok = ret.object_file_ok || []

            resolve(ret)
        }); //new Promise
    }
}