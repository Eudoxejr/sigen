export default (title, num) => {
	if (String(title).length > num - 2) {
		return String(title).substring(0, num) + '...';
	} else {
		return String(title);
	}
};