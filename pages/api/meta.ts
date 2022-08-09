import type { NextApiRequest, NextApiResponse } from 'next';
import getMetaData from 'metadata-scraper';
import { responseError, responseInvalid, responseSuccess } from '../../helper/response';

export default function getMetaTag(req: NextApiRequest, res: NextApiResponse) {
	const url = req.query.url as string;
	let host = req.headers.host;

	if (host === process.env.NEXT_PUBLIC_HOST) {
		if (url.length > 0) {
			const decode = decodeURIComponent(url);

			getMetaData(decode)
				.then((data: object) => {
					responseSuccess({
						res,
						result: data,
					});
				})
				.catch((err) => {
					responseError({ res, message: err });
				});
		} else {
			responseInvalid({ res, message: 'URL_DOES_NOT_EXIST' });
		}
	} else {
		responseError({ res, message: 'UNAUTHORIZED' });
	}
}
