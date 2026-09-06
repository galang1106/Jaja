export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const GROUP_ID = '758074897';

  try {
    // 1. Fetch info group lewat RoProxy (Bypass Blokir Roblox)
    const groupRes = await fetch(`https://groups.roproxy.com/v1/groups/${GROUP_ID}`);
    const groupData = await groupRes.json();

    // 2. Fetch member publik lewat RoProxy
    const membersRes = await fetch(
      `https://groups.roproxy.com/v1/groups/${GROUP_ID}/users?sortOrder=Desc&limit=50`
    );
    const membersData = await membersRes.json();

    const members = (membersData.data || []).map(m => ({
      username: m.user.username,
      displayName: m.user.displayName,
      role: m.role ? m.role.name : 'Member'
    }));

    return new Response(JSON.stringify({
      name: groupData.name || 'LAXEROUSE',
      memberCount: groupData.memberCount || 0,
      members: members
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      name: 'LAXEROUSE',
      memberCount: 0,
      members: [],
      error: err.message
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
