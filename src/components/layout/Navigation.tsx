import { FC } from 'react';
import Link from 'next/link';

const Navigation: FC = () => {
  return (
    <nav>
      <ul className="flex justify-center space-x-6">
        <li>
          <Link href="#about" className="hover:text-gray-300 transition-colors">
            About Me
          </Link>
        </li>
        <li>
          <Link href="#blog" className="hover:text-gray-300 transition-colors">
            Blog
          </Link>
        </li>
        <li>
          <Link href="#music" className="hover:text-gray-300 transition-colors">
            Music Production
          </Link>
        </li>
        <li>
          <Link href="#albums" className="hover:text-gray-300 transition-colors">
            My Albums
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;