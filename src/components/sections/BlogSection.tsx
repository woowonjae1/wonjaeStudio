import { FC } from 'react';

const AboutSection: FC = () => {
  return (
    <section id="about" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">About Me</h2>
        <p className="text-gray-600">
          Hello! I'm Woowonjae, a passionate music producer and blogger. 
          Welcome to my personal space where I share my journey and insights into music production.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;