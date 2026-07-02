# 🏥 HealthTech Triage System v2

Sistema de triagem hospitalar com IA Gemini (gratuito) + frontend integrado profissional.

---

## 🚀 Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Spring Boot 3.3 + Java 21 |
| Banco de Dados | PostgreSQL 16 |
| Segurança | Spring Security + JWT |
| IA | **Google Gemini 1.5 Flash (GRATUITO)** |
| Frontend | React + Vite |
| Docs | Swagger UI |
| Infra | Docker Compose |

---

## 🤖 API de IA — Google Gemini (Gratuita)

1. Acesse: https://aistudio.google.com/app/apikey
2. Clique em **"Create API Key"**
3. Copie a chave gerada
4. Configure via variável de ambiente:
   ```powershell
   # Windows PowerShell
   $env:GEMINI_API_KEY="AIza..."

   # Linux/Mac
   export GEMINI_API_KEY="AIza..."
   ```

**Limites gratuitos:** 15 req/min, 1M tokens/dia — mais que suficiente para ambiente hospitalar.

---

## ⚙️ Como rodar

```bash
# 1. Subir banco
docker-compose up -d

# 2. Definir chave Gemini
$env:GEMINI_API_KEY="sua-chave-aqui"

# 3. Rodar
./mvnw spring-boot:run
```

### 4. Acessar
- **Frontend:** http://localhost:8081
- **Swagger:** http://localhost:8081/swagger-ui.html
- **PgAdmin:** http://localhost:8080

---

## 🔑 Credenciais padrão

| Campo | Valor |
|-------|-------|
| E-mail | admin@healthtech.com |
| Senha | admin123 |

---

## 📋 Funcionalidades

- ✅ Login JWT com 4 roles (ADMIN, MEDICO, ENFERMEIRO, RECEPCIONISTA)
- ✅ **Dashboard** com métricas, distribuição de urgência e prévia da fila
- ✅ **Fila de atendimento** ordenada por urgência (Protocolo de Manchester)
- ✅ **Nova Triagem** com análise automática pelo Gemini AI
- ✅ **Detalhes** com sinais vitais, justificativa clínica e recomendações da IA
- ✅ **Gestão de pacientes** com CRUD completo
- ✅ **Histórico** de triagens por paciente
- ✅ Atualização de status (Aguardando → Em Atendimento → Atendido → Alta)
- ✅ Frontend profissional integrado — dark mode médico
- ✅ Swagger UI para testes de API
