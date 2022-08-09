import type { NextPage } from 'next';
import { Fragment, useState } from 'react';
import { getDomain } from '../helper';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const Home: NextPage = () => {
	const [value, setValue] = useState<any>(process.env.NEXT_PUBLIC_DEFAULT_URL === undefined ? '' : process.env.NEXT_PUBLIC_DEFAULT_URL);
	const [isLoading, setLoading] = useState(false);
	const [response, setResponse] = useState<any>(null);

	async function handleAnalyze(url: string) {
		setLoading(true);

		const domain = getDomain();
		const encode = encodeURIComponent(url);

		await fetch(`${domain}/api/meta?url=${encode}`)
			.then((response) => response.json())
			.then((res) => {
				const obj = res.result as object;
				setResponse(JSON.stringify(obj));
				setLoading(false);
			})
			.catch((err) => {
				if (err) {
					setResponse(null);
					setLoading(false);
				}
			});
	}

	const codeString = `${response}`;

	return (
		<div className='flex p-4 h-screen flex-1 flex-col justify-center items-center'>
			<h4 className='text-4xl'>Metadata Scraper</h4>

			<div className='pt-4  w-full md:w-4/12'>
				<label className='block'>
					<span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">Web URL</span>
					<input
						disabled={isLoading}
						type='url'
						value={value}
						onChange={(e) => setValue(e.target.value)}
						name='website'
						className='w-full mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1'
						placeholder={process.env.NEXT_PUBLIC_DEFAULT_URL}
					/>
				</label>

				<div className='mt-2'>
					<button
						onClick={() => handleAnalyze(value)}
						disabled={value.length === 0 || isLoading}
						className='disabled:opacity-75 disabled:cursor-not-allowed rounded-md enabled:hover:bg-blue-800 w-full px-4 py-2 bg-blue-700 text-slate-100'
					>
						{isLoading ? 'Loading...' : 'Analyze'}
					</button>

					<div className='mt-2'>
						<div className=''>
							<small className='italic'>
								Built by{' '}
								<a className='text-blue-700' href='https://saiki.link/me'>
									firmnardians
								</a>{' '}
								for everyone.
							</small>
						</div>
						<small className='italic'>
							Open Source:
							<a className='text-blue-700' href='https://github.com/firmnardians/metatag'>
								{' '}
								Github
							</a>
						</small>
					</div>
				</div>
			</div>

			{response !== null && (
				<Fragment>
					<div
						onClick={() => setResponse(null)}
						style={{ backgroundColor: '#00000073' }}
						className='cursor-pointer absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center'
					/>

					<div className='z-10 absolute w-full md:w-8/12 rounded h-4/6 overflow-scroll'>
						<SyntaxHighlighter customStyle={{ borderRadius: '12px', padding: '20px' }} style={docco} language='json'>
							{codeString}
						</SyntaxHighlighter>
					</div>
				</Fragment>
			)}
		</div>
	);
};

export default Home;
