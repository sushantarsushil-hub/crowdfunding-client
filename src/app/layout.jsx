import '../styles/globals.css';
import AppProviders from '../providers/app-providers';
import SkipLink from '../components/common/SkipLink';

export const metadata = {
  title: 'FundFlow — Modern Crowdfunding Platform Architecture',
  description: 'Discover, back, and create transformative community campaigns and innovative projects.',
  keywords: ['crowdfunding', 'fundraising', 'campaigns', 'credits', 'creators', 'supporters'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="emerald" className="h-full" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" suppressHydrationWarning>
        <SkipLink />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
