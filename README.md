# 🏋️‍♂️ Gym Notes — Aplicação Full Stack com Docker

![Image](https://m.media-amazon.com/images/I/51yUeZCS8FL._AC_UF1000,1000_QL80_.jpg)

Este projeto é uma aplicação **full stack** composta por:

- **Frontend:** React + Vite  
- **Backend:** Spring Boot (Java)  
- **Banco de Dados:** MongoDB  

A stack foi **totalmente containerizada com Docker** para facilitar o desenvolvimento e a execução local do ambiente completo com um único comando.

---

## 🚀 Estrutura do Projeto

```
.
├── docker-compose.yml
├── frontend/             # Aplicação React (porta 5173)
├── backend/
│   └── GymNotes/         # Aplicação Spring Boot (porta 8080)
├── .env.example          # Exemplo de variáveis de ambiente
└── .env                  # (crie este arquivo com base no exemplo)
```

---

## ⚙️ Requisitos

Antes de começar, certifique-se de ter instalado:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 🧩 Configuração do Ambiente

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seuusuario/gym_notes_Project.git
   cd gym_notes_Project
   ```

2. **Configure o arquivo `.env` com base no `.env.example`**  
   Um arquivo `.env.example` já está incluído no projeto.  
   Copie-o e ajuste suas variáveis conforme necessário:
   ```bash
   cp .env.example .env
   ```

   O conteúdo de exemplo é o seguinte:

   ```env
   # Exemplo de variáveis para rodar o projeto

   # Configurações de e-mail (coloque suas credenciais do Gmail ou outro SMTP)
   SPRING_MAIL_HOST=smtp.gmail.com
   SPRING_MAIL_PORT=587
   SPRING_MAIL_USERNAME=seu-email@gmail.com
   SPRING_MAIL_PASSWORD=sua-senha-ou-app-password

   # Configuração do MongoDB (não precisa alterar se for rodar localmente via Docker)
   SPRING_DATA_MONGODB_URI=mongodb://mongo:27017/gymnotes
   ```

3. **Suba os containers**
   ```bash
   docker-compose up --build
   ```

   Isso irá:
   - Construir as imagens do **frontend** e **backend**
   - Baixar a imagem oficial do **MongoDB**
   - Iniciar tudo automaticamente

---

## 🌐 Acesso aos serviços

| Serviço     | URL de acesso                | Porta |
|--------------|-----------------------------|--------|
| Frontend     | http://localhost:5173        | 5173   |
| Backend (API) | http://localhost:8080        | 8080   |
| MongoDB      | mongodb://localhost:27017     | 27017  |

---

## 🔄 Desenvolvimento

O `docker-compose` está configurado com **volumes** para permitir hot reload tanto no frontend quanto no backend:

- 🧠 **Frontend:** qualquer alteração em `/frontend` será refletida automaticamente.
- ⚙️ **Backend:** alterações no código em `/backend/GymNotes` são sincronizadas no container.

---

## 🗃️ Volumes Persistentes

O banco de dados MongoDB está configurado com volume nomeado:

```yaml
volumes:
  mongo_data:
```

Isso garante que seus dados sejam mantidos mesmo após o container ser reiniciado.

---

## 🧹 Parar e limpar containers

Para parar tudo:
```bash
docker-compose down
```

Para parar e **remover volumes e imagens**:
```bash
docker-compose down -v --rmi all
```

---

## 🧪 Testar conexão

Para verificar se o backend está se comunicando com o banco:

```bash
docker exec -it gymnotes-mongo mongosh
use gymnotes
show collections
```

---

## 📦 Deploy futuro

Este setup é ideal para desenvolvimento local.  
Para produção, considere:
- Adicionar um **Dockerfile de produção** otimizado para o frontend (build + Nginx).
- Utilizar variáveis de ambiente seguras em um **servidor remoto**.
- Configurar **rede e persistência** adequadas para o MongoDB.

---

## 💡 Dica

Se quiser ver os logs de cada serviço:

```bash
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongo
```

---

## 🧑‍💻 Autor

**Mario Junior**  
💼 Desenvolvedor Full Stack  
📧 [marioccomp@gmail.com](mailto:marioccomp@gmail.com)  
