const fs = require("fs");
const path = require("path");


/**
 *
 * @param {*} filepath relative file Path or filename with extension
 * @returns complete file path if file exists
 *
 */

const getFileLocation = (file) => {
	const fileLocation = path.join(__dirname, "..", "..", "./config", file);

	try {
		if (fs.existsSync(fileLocation)) {
			return fileLocation;
		}
		throw new Error(`------------Config file ${file} does not exist-------------`);
	} catch (error) {
		console.log(error.message);
	}
};

/**
 * Function to merge object
 * @param {Array} array an array of objects
 * @return {Object} merged object
 */
const mergeObject = (superConfigObject, newConfigJSON) => {
	try {
		if (Object.keys(newConfigJSON).length > 0) {
			for (const key in newConfigJSON) {
				if (Object.prototype.hasOwnProperty.call(newConfigJSON, key)) {
					const oldKeyValue = superConfigObject[key];
					const oldKeyValueType = typeof oldKeyValue;
					const newKeyValueType = typeof newConfigJSON[key];
					if (oldKeyValueType == "object" && newKeyValueType == "object") {
						if (Array.isArray(newConfigJSON[key]) && Array.isArray(superConfigObject[key])) {
							superConfigObject[key] = newConfigJSON[key];
						} else {
							superConfigObject[key] = mergeObject(superConfigObject[key], newConfigJSON[key]);
						}
					} else {
						superConfigObject[key] = newConfigJSON[key];
					}
				}
			}
		}
		return superConfigObject;
	} catch (error) {
		console.log("Error while merge config object");
		throw error;
	}
};

module.exports = (filesString) => {
	try {
		if (filesString == undefined || filesString == "") {
			return {};
		}
		let superConfigObject = {};
		const files = filesString.split(",");
		let isFirstFile = true;
		for (const file of files) {
			if (path.extname(file) !== ".json") {
				console.log(`The File ${file} is not a json file please enter a .JSON file`);
				return;
			}
			const fileLocation = getFileLocation(file);
			if (!fileLocation) {
				return;
			}
			const fileData = fs.readFileSync(fileLocation, "utf-8");
			let fileJSONData = {};
			try {
				fileJSONData = JSON.parse(fileData);
			} catch (error) {
			}
			if (isFirstFile) {
				if (files.length == 1) {
					return fileJSONData;
				}
				superConfigObject = fileJSONData;
			} else {
				superConfigObject = mergeObject(superConfigObject, fileJSONData);
			}
			isFirstFile = false;
		}
		return superConfigObject;
	} catch (error) {
		console.log(error);
	}
};
