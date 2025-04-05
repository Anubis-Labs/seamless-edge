import React from 'react';

const ResponsiveTest = () => {
  return (
    <div className="container">
      <h1 className="section-title mt-8">Responsive Design Test</h1>
      
      <section className="section">
        <h2>Flex System (formerly Grid)</h2>
        <div className="flex flex-wrap my-4">
          <div className="w-full">
            <div className="card">Full Width Column</div>
          </div>
        </div>
        
        <div className="flex flex-wrap my-4 gap-4">
          <div className="flex-1 min-w-[280px]">
            <div className="card">1/2 Column</div>
          </div>
          <div className="flex-1 min-w-[280px]">
            <div className="card">1/2 Column</div>
          </div>
        </div>
        
        <div className="flex flex-wrap my-4 gap-4">
          <div className="flex-1 min-w-[280px]">
            <div className="card">1/3 Column</div>
          </div>
          <div className="flex-1 min-w-[280px]">
            <div className="card">1/3 Column</div>
          </div>
          <div className="flex-1 min-w-[280px]">
            <div className="card">1/3 Column</div>
          </div>
        </div>
        
        <div className="flex flex-wrap my-4 gap-4">
          <div className="flex-2 min-w-[280px]">
            <div className="card">2/3 Column</div>
          </div>
          <div className="flex-1 min-w-[280px]">
            <div className="card">1/3 Column</div>
          </div>
        </div>
      </section>
      
      <section className="section">
        <h2>Responsive Typography</h2>
        <div className="card mb-4">
          <h1>This is Heading 1</h1>
          <h2>This is Heading 2</h2>
          <h3>This is Heading 3</h3>
          <p>This is regular paragraph text. Resize the browser to see how the font sizes adjust responsively to different screen sizes.</p>
        </div>
      </section>
      
      <section className="section">
        <h2>Responsive Buttons</h2>
        <div className="flex flex-wrap my-4 gap-4">
          <div className="flex-1 min-w-[200px]">
            <button className="btn btn-primary mb-4">Primary Button</button>
          </div>
          <div className="flex-1 min-w-[200px]">
            <button className="btn btn-secondary mb-4">Secondary Button</button>
          </div>
          <div className="flex-1 min-w-[200px]">
            <button className="btn btn-accent mb-4">Accent Button</button>
          </div>
        </div>
      </section>
      
      <section className="section">
        <h2>Flex Layout</h2>
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="p-4 flex-1" style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}>
              Flex Item 1
            </div>
            <div className="p-4 flex-1" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
              Flex Item 2
            </div>
            <div className="p-4 flex-1" style={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}>
              Flex Item 3
            </div>
          </div>
        </div>
      </section>
      
      <section className="section">
        <h2>Text Alignment</h2>
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="card text-center md:text-left">
              <p>This text is centered on mobile but left-aligned on desktop. Resize the window to test.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResponsiveTest; 