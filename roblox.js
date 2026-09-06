export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const GROUP_ID = '758074897';

  try {
    // 1. Ambil Informasi Group
    const groupRes = await fetch(`https://groups.roblox.com/v1/groups/${GROUP_ID}`);
    const groupData = await groupRes.json();

    // 2. Ambil Daftar Anggota Terbaru (Publik)
    const membersRes = await fetch(
      `https://groups.roblox.com/v1/groups/${GROUP_ID}/users?sortOrder=Desc&limit=25`
    );

    let membersWithTime = [];

    if (membersRes.ok) {
      const membersData = await membersRes.json();
      membersWithTime = (membersData.data || []).map(m => ({
        username: m.user.username,
        displayName: m.user.displayName,
        joinTime: 'Member Aktif'
      }));
    }

    return new Response(JSON.stringify({
      name: groupData.name || 'LAXEROUSE',
      memberCount: groupData.memberCount || 0,
      members: membersWithTime
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
