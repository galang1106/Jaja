export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const GROUP_ID = '758074897';

  try {
    // 1. Fetch Info Grup via Corsproxy
    const groupRes = await fetch(
      `https://corsproxy.io/?${encodeURIComponent('https://groups.roblox.com/v1/groups/' + GROUP_ID)}`
    );
    const groupData = await groupRes.json();

    // 2. Fetch Member Terbaru via Corsproxy
    const membersRes = await fetch(
      `https://corsproxy.io/?${encodeURIComponent('https://groups.roblox.com/v1/groups/' + GROUP_ID + '/users?sortOrder=Desc&limit=100')}`
    );
    const membersData = await membersRes.json();

    // 3. Susun Format Data Member
    const formattedMembers = (membersData.data || []).map(item => ({
      userId: item.user.userId,
      username: item.user.username,
      displayName: item.user.displayName,
      role: item.role ? item.role.name : 'Member',
      rank: item.role ? item.role.rank : 1
    }));

    return new Response(
      JSON.stringify({
        status: 'success',
        groupId: GROUP_ID,
        groupName: groupData.name || 'LAXEROUSE',
        memberCount: groupData.memberCount || 0,
        totalFetched: formattedMembers.length,
        members: formattedMembers
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, max-age=0'
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: error.message,
        groupName: 'LAXEROUSE',
        memberCount: 0,
        members: []
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
