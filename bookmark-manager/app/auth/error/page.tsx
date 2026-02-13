import Link from 'next/link'

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-red-600">
          Authentication Error
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Something went wrong during sign in. Please try again.
        </p>
        <Link
          href="/"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
