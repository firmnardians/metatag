import { NextApiResponse } from 'next';

export function responseSuccess({ res, result }: { res: NextApiResponse; result: object }) {
	return res.status(200).json({ result, code: 200, message: 'SUCCESS' });
}

export function responseInvalid({ res, message }: { res: NextApiResponse; message: any }) {
	return res.status(400).json({ result: null, code: 400, message });
}

export function responseError({ res, message }: { res: NextApiResponse; message: any }) {
	return res.status(500).json({ result: null, code: 500, message });
}
