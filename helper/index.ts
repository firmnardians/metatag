export function getDomain() {
	const get = window.location.host;

	return process.env.NODE_ENV === 'development' ? `http://${get}` : `https://${get}`;
}
