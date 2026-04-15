"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
export default function BlogPost() {
  const { slug } = useParams<{slug:string}>();
  const [post, setPost] = useState<any>(null);
  useEffect(() => {
    fetch("/api/blog/"+slug).then(r=>r.json()).then(d=>{ if(!d.error) setPost(d); });
  },[slug]);
  if(!post) return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center"><div className="text-green-500 animate-pulse">Loading…</div></div>;
  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24">
      <div className="bg-gradient-to-br from-green-900 to-green-700 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-6">
            <Link href="/" className="hover:text-white">Home</Link><span>›</span>
            <Link href="/blog" className="hover:text-white">Blog</Link><span>›</span>
            <span className="text-white">{post.category}</span>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-400/20 text-green-300 mb-5">{post.category}</span>
          <h1 className="font-heading font-black text-4xl lg:text-5xl text-white mb-5 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 text-green-300 text-sm">
            <span>👁 {post.views} views</span>
            {post.publishedAt&&<span>📅 {new Date(post.publishedAt).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</span>}
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {post.coverImage&&<div className="card rounded-2xl overflow-hidden mb-10"><Image src={post.coverImage} alt={post.title} width={900} height={450} className="w-full h-80 object-cover"/></div>}
        <div className="prose prose-green max-w-none text-[var(--text-3)] leading-relaxed" dangerouslySetInnerHTML={{__html:post.content}}/>
        {post.tags?.length>0&&(
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-green-100 dark:border-green-900">
            {post.tags.map((t:string)=><span key={t} className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 text-xs rounded-full">{t}</span>)}
          </div>
        )}
        <div className="mt-10">
          <Link href="/blog" className="btn-outline text-sm">← Back to Blog</Link>
        </div>
      </div>
    </div>
  );
}
