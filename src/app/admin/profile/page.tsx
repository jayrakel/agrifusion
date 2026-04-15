"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export default function ProfileAdmin() {
  const [profile, setProfile] = useState({ name:"", email:"" });
  const [passwords, setPasswords] = useState({ current:"", next:"", confirm:"" });
  const [saving, setSaving]   = useState(false);
  const [changing, setChanging] = useState(false);
  useEffect(()=>{fetch("/api/admin/profile",{credentials:"include"}).then(r=>r.json()).then(d=>{if(d)setProfile({name:d.name||"",email:d.email||""});});},[]);
  const saveProfile = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/profile",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:profile.name,email:profile.email}),credentials:"include"});
    if(res.ok)toast.success("Profile updated!"); else toast.error("Update failed.");
    setSaving(false);
  };
  const changePassword = async () => {
    if(!passwords.current) return toast.error("Enter current password.");
    if(passwords.next.length<8) return toast.error("Min 8 characters.");
    if(passwords.next!==passwords.confirm) return toast.error("Passwords do not match.");
    setChanging(true);
    const res = await fetch("/api/admin/profile",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword:passwords.current,newPassword:passwords.next}),credentials:"include"});
    const d   = await res.json();
    if(res.ok){toast.success("Password changed!");setPasswords({current:"",next:"",confirm:""});}
    else toast.error(d.error||"Failed.");
    setChanging(false);
  };
  const inp = "inp";
  return (
    <div className="p-8 max-w-xl">
      <h1 className="font-heading font-black text-2xl text-green-900 dark:text-green-100 mb-1">My Profile</h1>
      <p className="text-green-500 text-sm mb-8">Update your name, email and password.</p>
      <div className="space-y-5">
        <div className="card rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-bold text-green-900 dark:text-green-100">Profile Info</h2>
          <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Name</label><input className={inp} value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))}/></div>
          <div><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">Email</label><input type="email" className={inp} value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))}/></div>
          <button onClick={saveProfile} disabled={saving} className="btn-primary disabled:opacity-50">{saving?"Saving…":"Save Profile"}</button>
        </div>
        <div className="card rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-bold text-green-900 dark:text-green-100">Change Password</h2>
          {["current","next","confirm"].map((k,i)=>(
            <div key={k}><label className="block text-xs text-green-600 uppercase tracking-widest mb-2">{["Current Password","New Password","Confirm New Password"][i]}</label><input type="password" className={inp} value={(passwords as any)[k]} onChange={e=>setPasswords(p=>({...p,[k]:e.target.value}))} placeholder="••••••••"/></div>
          ))}
          <button onClick={changePassword} disabled={changing} className="btn-primary disabled:opacity-50">{changing?"Changing…":"Change Password"}</button>
        </div>
      </div>
    </div>
  );
}
