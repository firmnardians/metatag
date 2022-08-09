import type { NextPage } from 'next';
import { Fragment, useState } from 'react';
import { getDomain } from '../helper';
import Head from 'next/head';

const Home: NextPage = () => {
	const [value, setValue] = useState<any>(process.env.NEXT_PUBLIC_DEFAULT_URL === undefined ? '' : process.env.NEXT_PUBLIC_DEFAULT_URL);
	const [isLoading, setLoading] = useState(false);
	const [response, setResponse] = useState<any>(null);
	const [isInvalidUrl, setInvalidUrl] = useState(false);

	async function handleAnalyze(url: string) {
		setLoading(true);
		setInvalidUrl(false);

		const domain = getDomain();
		const encode = encodeURIComponent(url);

		await fetch(`${domain}/api/meta?url=${encode}`)
			.then((response) => response.json())
			.then((res) => {
				if (res.code === 200) {
					const obj = res.result as any;
					const convert = Object.keys(obj).map((key: any) => [key, obj[key]]);

					setResponse(convert);
					setLoading(false);
				} else {
					if (res.code === 500) {
						if (res.message.code === 'ERR_INVALID_URL') {
							setInvalidUrl(true);
						}

						setLoading(false);
					} else {
						setLoading(false);
					}
				}
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
		<Fragment>
			<Head>
				<title>Metadata Scraper</title>
				<meta name='description' content='Tool for scraping/parsing metadata from a web page' />
			</Head>

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

					{isInvalidUrl && (
						<div className='pt-2'>
							<p className='text-red-700'>Uppsss... Invalid URL</p>
						</div>
					)}

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
							className='cursor-pointer fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center'
						/>

						<div className='z-10 fixed w-full md:w-8/12 rounded h-4/6 overflow-scroll bg-white p-4'>
							<span className='text-slate-600 font-semibold'>&#123;</span>
							<div className='pl-10'>
								{response.map((item: any, index: number) => {
									return (
										<div className='flex mb-2' key={index}>
											<p className='text-teal-600 font-semibold pr-2'>&quot;{item[0]}&quot;:</p>
											<p className='text-amber-600 font-semibold'>
												&quot;{item[1]}&quot;{index !== response.length - 1 && <span className='text-slate-700'>,</span>}
											</p>
										</div>
									);
								})}
							</div>
							<span className='text-slate-600 font-semibold'> &#125;</span>
						</div>
					</Fragment>
				)}
			</div>
		</Fragment>
	);
};

export default Home;
