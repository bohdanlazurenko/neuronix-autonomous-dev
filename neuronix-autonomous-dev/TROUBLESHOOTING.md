# 🔍 Z.AI API Key Issue

## Проблема
API ключ Z.AI возвращает ошибку 401: "令牌已过期或验证不正确" (Token expired or incorrect)

## Возможные причины:

### 1. Ключ истёк
- Z.AI токены могут иметь срок действия
- Нужно сгенерировать новый ключ на https://z.ai

### 2. Неправильный формат ключа
- Текущий ключ: `ds-38d55df78f1e4f439f5bbdd9fce3e8d2`
- Возможно, нужен другой формат

### 3. Неправильный endpoint
- Текущий: `https://api.z.ai/api/coding/paas/v4/chat/completions`
- Возможно, нужен другой URL

## Решения:

### Option A: Получить новый Z.AI ключ

1. Зайдите на https://z.ai или https://api.z.ai
2. Сгенерируйте новый API ключ
3. Обновите в Vercel:
   ```bash
   vercel env rm ZAI_API_KEY production
   vercel env add ZAI_API_KEY production
   # Вставьте новый ключ
   vercel --prod
   ```

### Option B: Использовать OpenAI (РЕКОМЕНДУЕТСЯ)

Если у вас есть OpenAI API ключ, это будет работать сразу:

```bash
# Добавить OpenAI ключ
vercel env add OPENAI_API_KEY production
# Вставить ключ вида: sk-proj-...

# Redeploy
vercel --prod

# Тест
curl https://neuronix-autonomous-dev.vercel.app/api/provider
# Должен показать: "provider": "openai"
```

### Option C: Локальный тест

Проверим локально с вашим ключом:

```bash
cd /home/bohdan/ai_workshop/ai_it/neuronix-autonomous-dev

# Создать .env.local
echo "ZAI_API_KEY=ds-38d55df78f1e4f439f5bbdd9fce3e8d2" > .env.local

# Запустить локально
npm run dev

# Тестировать на http://localhost:3000
```

## Текущий статус:

✅ Код обновлён для Z.AI  
✅ Deployment работает  
❌ Z.AI API ключ неактивен/истёк  
⏳ Нужен новый ключ или переключение на OpenAI

## Что делать дальше?

**Вариант 1**: Получите новый Z.AI ключ  
**Вариант 2**: Используйте OpenAI API (если есть ключ)  
**Вариант 3**: Протестируйте локально чтобы увидеть точную ошибку
