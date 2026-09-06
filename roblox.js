export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const GROUP_ID = '758074897';
  const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY || '8DIkI8PueE208ZIR3dfU7u4jLlLF2eweKaX/1pSDunUeeXERZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaGRXUWlPaUpTYjJKc2IzaEpiblJsY201aGJDSXNJbWx6Y3lJNklrTnNiM1ZrUVhWMGFHVnVkR2xqWVhScGIyNVRaWEoyYVdObElpd2lZbUZ6WlVGd2FVdGxlU0k2SWpoRVNXdEpPRkIxWlVVeU1EaGFTVkl6WkdaVk4zVTBha3hzVEVZeVpYZGxTMkZZTHpGd1UwUjFibFZsWlZoRlVpSXNJbTkzYm1WeVNXUWlPaUl5TURZME9URXlNVE0ySWl3aVpYaHdJam94TnpnNE5qYzROelF5TENKcFlYUWlPakUzT0RnMk56VXhORElzSW01aVppSTZNVGM0T0RZM05URTBNbjAuWW5nTEVQTDlFd1AyX25yT3JrS3RadmdJQmdETG01XzRmVV9EdlB4WHVCdVhIODJGcGFOLXZnU2kyUFQ4REtUY21XRlNZQ3JsdkNaTjdBb3hydVF4R2VsRjB0MUg2eXdiZTFhN1dsWWVLZTRLYk4wbUlrTjJzRjBLV1M0RVdPTkNDQVNEVHJjVzc0ZTk0N3ZxbExKNGNTUHR4UTRGZUk0UHRkSGlRZFM3bmhPUWM4YVVoOV9QWi1lWGtjN2RGand4WTltMTl6SjhQQjVURkdSSlNfT21xcVB6RnAxZ25BRTZlT01yallfdHVfRWFkdlNTQkNLUjF3bDJZTjV3VlN3aU5hSm42Q252dHZVS2NUX2lITUNKZGtRY2tpM2VHYnJOQldwdEpMWnlGTHRXa3plczFVeEc2UHRoWkRyU0lIcmd0eUxFMDVlenR4QktpQmdXbktOc0lR';

  try {
    const groupRes = await fetch(`https://groups.roblox.com/v1/groups/${GROUP_ID}`);
    const groupData = await groupRes.json();

    const auditRes = await fetch(
      `https://apis.roblox.com/cloud/v2/groups/${GROUP_ID}/audit-logs?filter=actionType=='MemberJoinedGroup'&pageSize=25`,
      {
        headers: {
          'x-api-key': ROBLOX_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    let logs = [];
    if (auditRes.ok) {
      const auditData = await auditRes.json();
      logs = auditData.auditLogs || [];
    }

    const membersWithTime = logs.map(log => {
      const rawDate = new Date(log.createTime);
      return {
        username: log.actor.user ? log.actor.user.split('/')[1] : 'User',
        displayName: log.actor.displayName || 'Member',
        joinTime: rawDate.toLocaleString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      };
    });

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
