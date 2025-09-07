export default function TestNav() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Navigation Test Page</h1>
      <p>If you can see this page, basic routing works.</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/dashboard" style={{ display: 'block', marginBottom: '10px', color: 'blue' }}>
          Test Dashboard Link
        </a>
        <a href="/dashboard/students" style={{ display: 'block', marginBottom: '10px', color: 'blue' }}>
          Test Students Link
        </a>
        <a href="/dashboard/questions" style={{ display: 'block', marginBottom: '10px', color: 'blue' }}>
          Test Questions Link
        </a>
        <a href="/dashboard/groups" style={{ display: 'block', marginBottom: '10px', color: 'blue' }}>
          Test Groups Link
        </a>
        <a href="/dashboard/analytics" style={{ display: 'block', marginBottom: '10px', color: 'blue' }}>
          Test Analytics Link
        </a>
        <a href="/dashboard/generator" style={{ display: 'block', marginBottom: '10px', color: 'blue' }}>
          Test Generator Link
        </a>
      </div>
      <p>These are plain HTML links that should work regardless of React/Next.js issues.</p>
    </div>
  )
}