/* eslint-disable max-len */
/* eslint-disable valid-jsdoc */
const moment = require("moment");
const forge = require("node-forge");
const fsExtra = require("fs-extra");
const im = require("imagemagick");
const _this = {};
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
// const alertNotificationJSON = require("../config/alert.notification.json");
const XLSX = require("xlsx");

const startDelimiter =
	(config.parser && config.parser.startDelimiter) || "${";
const endDelimiter = (config.parser && config.parser.endDelimiter) || "}";

_this.getUtcTime = function(inputTime, utcOffset, inputFormat, outputFormat = true) {
	const dateObject = moment(inputTime, inputFormat);
	if (outputFormat === true) {
		return dateObject.add(_this.convertUtcOffsetToMinute(utcOffset), "minute").toDate();
	} else {
		return dateObject.add(_this.convertUtcOffsetToMinute(utcOffset), "minute").format(outputFormat);
	}
};

// Generate Password Hash
_this.generatePasswordHash = function(password) {
	return forge.md.sha512.create().update(password).digest().toHex();
};

/**
 * Function to check given string valid object id or not. Return `true` if valid else return `false`.
 * @param {string} id String to check is valid object id or not
 */
global.isValidObjectId = function(id) {
	try {
		return ObjectId.isValid(id) && new ObjectId(id) == id;
	} catch (error) {
		throw error;
	}
};

global.firstCharToUppercase = function(str) {
	try {
		if (!str) {
			return "";
		}
		return str.charAt(0).toUpperCase() + str.slice(1);
	} catch (error) {
		return "";
	}
};

_this.getDateRangeByFilter = function(filterName = "last_30_days") {
	switch (filterName) {
	case "last_7_days":
		return [moment().subtract(7, "days").format("YYYY-MM-DD 00:00:00"), moment().format("YYYY-MM-DD 23:59:59")];
	case "last_30_days":
		return [moment().subtract(29, "days").format("YYYY-MM-DD 00:00:00"), moment().format("YYYY-MM-DD 23:59:59")];
	case "this_month":
		return [moment().startOf("month").format("YYYY-MM-DD 00:00:00"), moment().format("YYYY-MM-DD 23:59:59")];
	case "last_month":
		return [moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD 00:00:00"), moment().subtract(1, "month").endOf("month").format("YYYY-MM-DD 23:59:59")];
	case "last_3_months":
		return [moment().subtract(3, "month").format("YYYY-MM-DD 00:00:00"), moment().format("YYYY-MM-DD 23:59:59")];
	case "last_6_months":
		return [moment().subtract(6, "month").format("YYYY-MM-DD 00:00:00"), moment().format("YYYY-MM-DD 23:59:59")];
	case "this_year":
		return [moment().startOf("year").format("YYYY-MM-DD 00:00:00"), moment().format("YYYY-MM-DD 23:59:59")];
	case "last_year":
		return [moment().subtract(12, "month").startOf("year").format("YYYY-MM-DD 00:00:00"), moment().subtract(12, "month").endOf("year").format("YYYY-MM-DD 23:59:59")];
	default:
		return [null, null];
	}
};

/**
 * Function used for decides sorting,pagination fields relative to data tables and return this whole object.
 * @param {object} req , request object
 */
_this.paginationQuery = function(req) {
	return new Promise((resolve) => {
		const row = req.body.length;
		const offset = req.body.start;
		// Set default sorting object
		let sort = {
			createdOn: -1
		};
		// Check if sort object is set in body and sort field's direction is not normal then prepare the sort object related to mongodb requirement
		if (req.body.sort != undefined && Object.keys(req.body.sort).length > 0 && req.body.sort.dir != "") {
			sort = {};
			const order = req.body.sort.dir == "desc" ? -1 : 1;
			const field = req.body.sort.active;
			sort[field] = order;
		}
		resolve({
			row: row,
			offset: offset,
			sort: sort
		});
	});
};

module.exports = _this;
