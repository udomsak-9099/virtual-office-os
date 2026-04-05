export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
      <div className="text-center max-w-2xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-brand-900 mb-4">
          Virtual Office OS
        </h1>
        <p className="text-xl text-brand-700 mb-8">
          Digital headquarters platform for modern companies.
          Manage communications, tasks, documents, approvals, and AI — all in one place.
        </p>
        <a
          href="/auth/login"
          className="inline-flex items-center px-8 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
