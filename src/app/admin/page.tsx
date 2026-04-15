import { prisma } from '@/lib/prisma';
import Link from 'next/link';
export default async function AdminDashboard() {
  const [orders, products, messages, subscribers, revenue, pendingOrders, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count({ where:{ active:true } }),
    prisma.message.count({ where:{ status:'UNREAD' } }),
    prisma.subscriber.count({ where:{ status:'ACTIVE' } }),
    prisma.order.aggregate({ _sum:{ total:true }, where:{ paymentStatus:'PAID' } }),
    prisma.order.count({ where:{ status:'PENDING' } }),
    prisma.order.findMany({ orderBy:{ createdAt:'desc' }, take:6, include:{ items:true } }),
  ]);

  const stats = [
    { icon:'🛒', label:'Total Orders',     val:orders,    sub:`${pendingOrders} pending`,              href:'/admin/orders',   color:'green'  },
    { icon:'💰', label:'Revenue (Paid)',    val:`KES ${((revenue._sum.total||0)).toLocaleString()}`, sub:'from paid orders', href:'/admin/orders',   color:'amber'  },
    { icon:'🥬', label:'Active Products',  val:products,  sub:'in catalogue',                          href:'/admin/products', color:'lime'   },
    { icon:'📧', label:'Subscribers',      val:subscribers,sub:'active',                              href:'/admin/subscribers',color:'teal'  },
  ];

  const statusColor: Record<string,string> = {
    PENDING:'text-yellow-600 bg-yellow-50',CONFIRMED:'text-blue-600 bg-blue-50',
    PROCESSING:'text-purple-600 bg-purple-50',OUT_FOR_DELIVERY:'text-orange-600 bg-orange-50',
    DELIVERED:'text-green-600 bg-green-50',CANCELLED:'text-red-600 bg-red-50',
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading font-black text-3xl text-green-900 dark:text-green-100 mb-1">Dashboard</h1>
        <p className="text-green-600 dark:text-green-400 text-sm">Welcome back! Here's what's happening at Agrifusion.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.label} href={s.href} className="card card-hover rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{s.icon}</span>
              {s.label === 'Total Orders' && pendingOrders > 0 && (
                <span className="text-[10px] font-black text-white px-2 py-0.5 rounded-full grad-green">{pendingOrders} new</span>
              )}
              {s.label === 'Subscribers' && messages > 0 && (
                <span className="text-[10px] font-black text-white px-2 py-0.5 rounded-full bg-red-500">{messages} msgs</span>
              )}
            </div>
            <div className="font-heading font-black text-2xl grad-text mb-1">{s.val}</div>
            <div className="text-green-500 text-xs">{s.sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-green-900 dark:text-green-100">Recent Orders</h2>
            <Link href="/admin/orders" className="text-green-600 text-xs hover:text-green-500 transition-colors">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map(o => (
              <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-all">
                <div className="w-9 h-9 rounded-full grad-green flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{o.customerName[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-green-900 dark:text-green-100">{o.customerName}</div>
                  <div className="text-green-500 text-xs">{o.items.length} item{o.items.length!==1?'s':''} · KES {o.total.toLocaleString()}</div>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${statusColor[o.status]||'text-gray-500 bg-gray-50'}`}>{o.status}</span>
              </Link>
            ))}
            {recentOrders.length===0 && <p className="text-green-500 text-sm text-center py-6">No orders yet.</p>}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card rounded-2xl p-6">
          <h2 className="font-heading font-bold text-green-900 dark:text-green-100 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { href:'/admin/products/new',   icon:'➕', label:'Add Product'    },
              { href:'/admin/orders',         icon:'🛒', label:'View Orders'    },
              { href:'/admin/categories/new', icon:'🗂️', label:'Add Category'   },
              { href:'/admin/messages',       icon:'💬', label:'View Messages'  },
              { href:'/admin/blog/new',       icon:'✏️', label:'Write Blog Post'},
              { href:'/admin/newsletter',     icon:'📨', label:'Newsletter'     },
              { href:'/admin/settings',       icon:'⚙️', label:'Settings'       },
              { href:'/admin/media',          icon:'🗃️', label:'Media Library'  },
            ].map(a => (
              <Link key={a.href} href={a.href} className="flex items-center gap-2.5 p-3.5 card card-hover rounded-xl">
                <span>{a.icon}</span><span className="text-sm font-medium text-green-900 dark:text-green-100">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
