export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const GROUP_ID = '758074897';
  const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY || '8DIkI8PueE208ZIR3dfU7u4jLlLF2eweKaX/1pSDunUeeXERZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaGRXUWlPaUpTYjJKc2IzaEpiblJsY201aGJDSXNJbWx6Y3lJNklrTnNiM1ZrUVhWMGFHVnVkR2xqWVhScGIyNVRaWEoyYVdObElpd2lZbUZ6WlVGd2FVdGxlU0k2SWpoRVNXdEpPRkIxWlVVeU1EaGFTVkl6WkdaVk4zVTBha3hzVEVZeVpYZGxTMkZZTHpGx1UwUjFibFZsWlZoRlVpSXNJbTkzYm1WeVNXUWlPaUl5TURZME9URXlNVE0ySWl3aVpYaHdJam94TnpnNE5qYzROelF5TENKcFlYUWlPakUzT0RnMk56VXhORElzSW01aVppSTZNVGM0T0RZM05URTBNbjAuWW5nTEVQTDlFd1AyX25yT3JrS3RadmdJQmdETG01XzRmVV9EdlB4WHVCdVhIODJGcGFOLXZnU2kyUFQ4REtUY21XRlNZQ3JsdkNaTjdBb3hydVF4R2VsRjB0MUg2eXdiZTFhN1dsWWVLZTRLYk4wbUlrTjJzRjBLV1M0RVdPTkNDQVNEVHJjVzc0ZTk0N3ZxbExKNGNTUHR4UTRGZUk0UHRkSGlRZFM3bmhPUWM4YVVoOV9QWi1lWGtjN2RGand4WTltMTl6SjhQQjVURkdSSlNfT21xcVB6RnAxZ25BRTZlT01yallfdHVfRWFkdlNTQkNLUjF3bDJZTjV3VlN3aU5hSm42Q252dHZVS2NUX2lITUNKZGtRY2tpM2VHYnJOQldwdEpMWnlGTHRXa3plczFVeEc2UHRoWkRyU0lIcmd0eUxFMDVlenR4QktpQmdXbktOc0lR';

  try {
    // 1. Ambil Informasi Utama Group (Nama & Total Member)
    const groupRes = await fetch(`https://groups.roblox.com/v1/groups/${GROUP_ID}`);
    const groupData = await groupRes.json();

    // 2. Coba Panggil Audit Log Open Cloud
    let membersWithTime = [];
    
    try {
      const auditRes = await fetch(
        `https://apis.roblox.com/cloud/v2/groups/${GROUP_ID}/audit-logs?maxPageSize=25`,
        {
          headers: {
            'x-api-key': ROBLOX_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      if (auditRes.ok) {
        const auditData = await auditRes.json();
        const logs = auditData.auditLogs || [];

        membersWithTime = logs.map(log => {
          const rawDate = new Date(log.createTime || Date.now());
          const userPath = log.actor?.user || '';
          const userId = userPath.split('/')[1] || '';

          return {
            username: userId ? `ID: ${userId}` : (log.actor?.displayName || 'User'),
            displayName: log.actor?.displayName || 'Member Roblox',
            joinTime: rawDate.toLocaleString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          };
        });
      }
    } catch (e) {
      console.log('Audit log fallback triggered');
    }

    // 3. Fallback: Jika Audit Log kosong/gagal, gunakan API Member Publik (Selalu Berhasil)
    if (membersWithTime.length === 0) {
      const usersRes = await fetch(`https://groups.roblox.com/v1/groups/${GROUP_ID}/users?sortOrder=Desc&limit=25`);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        membersWithTime = (usersData.data || []).map(m => ({
          username: m.user.username,
          displayName: m.user.displayName,
          joinTime: 'Aktif'
        }));
      }
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
