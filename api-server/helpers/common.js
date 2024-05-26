module.exports = {
	getNamePart: function(name) {
		const reWhiteSpace = new RegExp("/^s+$/");

		// Check for white space
		if (reWhiteSpace.test(name)) {
			const fullName = {
				first: name
			};
			return fullName;
		} else {
			first = name.substring(0, name.lastIndexOf(" "));
			last = name.substring(name.lastIndexOf(" ") + 1);
			const fullName = {
				first: first,
				last: last
			};
			return fullName;
		}
	}
};
