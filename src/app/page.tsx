import { env } from '@/env.mjs';

export default async function Page() {
  const response = await fetch(env.APP_URL + '/api/recent', {
    cache: 'no-cache',
  });
  const data = await response.json();

  return (
    <>
      <h1>Test</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
