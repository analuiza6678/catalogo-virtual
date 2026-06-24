export const adminErrorMessages: Record<string, string> = {
  "invalid-email": "Digite um e-mail valido.",
  "short-password": "A senha precisa ter pelo menos 8 caracteres.",
  "password-mismatch": "As senhas digitadas sao diferentes.",
  credentials: "E-mail ou senha incorretos.",
  "email-not-confirmed": "Confirme seu e-mail antes de entrar.",
  "user-not-found": "Nenhuma conta foi encontrada com este e-mail.",
  "owner-exists": "Esta loja ja possui administrador. Entre com o e-mail cadastrado ou redefina a senha.",
  "owner-mismatch": "Este e-mail nao e o administrador da loja existente.",
  schema: "As tabelas do admin nao foram encontradas. Execute o arquivo supabase/schema.sql no SQL Editor.",
  "store-create": "A conta entrou, mas a loja nao pôde ser criada automaticamente.",
  "site-url": "NEXT_PUBLIC_SITE_URL esta ausente ou invalida.",
  callback: "O link de acesso expirou ou a URL de callback esta incorreta.",
  reset: "Nao foi possivel enviar o e-mail de recuperacao agora.",
  "reset-session": "Abra novamente o link recebido por e-mail para criar a nova senha.",
  "password-update": "Nao foi possivel atualizar a senha. Solicite um novo link.",
  signup: "Nao foi possivel criar a conta. Confira os dados e tente novamente.",
  login: "Nao foi possivel entrar agora. Tente novamente.",
  config: "O Supabase ainda nao foi configurado."
};

export const adminSuccessMessages: Record<string, string> = {
  confirm: "Conta criada. Confirme o e-mail recebido para continuar.",
  verified: "E-mail confirmado. Seu acesso esta pronto.",
  "reset-sent": "Link enviado. Confira sua caixa de entrada e o spam.",
  "password-updated": "Senha atualizada com sucesso. Entre com a nova senha."
};

