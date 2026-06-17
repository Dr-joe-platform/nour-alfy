import { Metadata } from 'next';
import AdminSidebar from './Sidebar';
import styles from './Admin.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Admin Dashboard | NOUR ALFY',
    manifest: `/api/admin-manifest?locale=${locale}`,
  };
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.adminContainer}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
