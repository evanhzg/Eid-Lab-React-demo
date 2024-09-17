import { Icon } from '@iconify/react/dist/iconify.js';
import '../styles/components/Hero.css';
import Input from './Input';
import Button from './Button';

export default function Hero() {
	return (
		<div className='hero'>
			<p className='hero-slogan'>paw now, soar after</p>
			<p className='hero-description'>
				Made{' '}
				<span className='hero-description-highlight'>
					for students, by students
				</span>{' '}
				knowing the pain of job applications. Join our waitlist now.
			</p>
			<div className='input-container'>
				<Input label={'Your wonderful email'} />
				<Button className='hero-button'>
					<Icon icon='mingcute:mail-ai-fill' />
				</Button>
			</div>
		</div>
	);
}
