'use client';

export default function BackgroundOrbs() {
  return (
    <>
      <div
        className="bg-orb bg-orb-purple"
        style={{
          width: '500px',
          height: '500px',
          top: '-200px',
          left: '-100px',
        }}
      />
      <div
        className="bg-orb bg-orb-pink"
        style={{
          width: '400px',
          height: '400px',
          top: '50%',
          right: '-150px',
        }}
      />
      <div
        className="bg-orb bg-orb-cyan"
        style={{
          width: '300px',
          height: '300px',
          bottom: '-100px',
          left: '30%',
        }}
      />
    </>
  );
}
