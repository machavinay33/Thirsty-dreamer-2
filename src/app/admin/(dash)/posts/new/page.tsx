import { PageHeader } from '@/components/admin/ui';
import { PostForm } from '@/components/admin/PostForm';
import { requireStaff } from '@/lib/auth';

export const metadata = { title: 'New post' };

export default async function NewPost() {
  await requireStaff();
  return (
    <>
      <PageHeader title="New post" />
      <PostForm />
    </>
  );
}
