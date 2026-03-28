# SF AI Startup Map

San Francisco の AI-native startup を、8-bit game tone の地図 UI で見て回れるシンプルな web app です。

地図上のマーカーとサイドバーを行き来しながら、各スタートアップのカテゴリ、所在地、概要をすばやく確認できます。UI はプロダクト寄りに保ちつつ、マップ表現には少しレトロゲームっぽい空気感を入れています。

## What's This

- San Francisco の AI スタートアップを地図上で一覧できるアプリ
- Startup data はソース付きで `lib/companies.ts` に管理
- `maplibre-gl` ベースのマップを 8-bit / voxel ライクな見た目に調整
- サイドバーから会社を探し、地図上で位置を確認できる構成

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- MapLibre GL JS
- Lucide React
- pnpm

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```
