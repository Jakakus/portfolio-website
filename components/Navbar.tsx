import Link from 'next/link';
import SocialLinks from './SocialLinks';

const Navbar: React.FC = () => {
  return (
    <nav className="p-4 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/">
            <a className="hover:text-blue-500">Home</a>
          </Link>
          <Link href="/projects">
            <a className="hover:text-blue-500">Projects</a>
          </Link>
          <Link href="/about">
            <a className="hover:text-blue-500">About</a>
          </Link>
          <Link href="/contact">
            <a className="hover:text-blue-500">Contact</a>
          </Link>
        </div>
        <SocialLinks />
      </div>
    </nav>
  );
};

export default Navbar;
