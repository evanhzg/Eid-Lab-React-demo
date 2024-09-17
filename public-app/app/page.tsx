'use client';
import Header from './components/Header';
import Hero from './components/Hero';

export default function Home() {
	return (
		<div className='container homepage'>
			<div className='page-content'>
				<Header />
				<Hero />
			</div>
		</div>
	);
}
