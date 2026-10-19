import { auth } from 'void/client'
import {useEffect, useState} from 'react'
import { Alert, Avatar, Box, Button, Chip, CircularProgress, Divider, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import AddIcon from '@mui/icons-material/Add'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'

type Expense = {
    id:number;
    amount:number;
    memo:string;
};

export default function ExpensesDemo() {

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [amount, setAmount] = useState("");
    const [memo, setMemo] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);
    const [checking, setChecking] = useState(true);

    async function loadExpenses(){
        const response = await fetch("/api/expenses");

        if(!response.ok){
            throw new Error("一覧を取得できませんでした");
        }

        const data: Expense[] = await response.json();
        setExpenses(data);
    }

    useEffect(() =>{
        async function initialize() {
            try {
                const response = await fetch('/api/me');
                if (response.status === 401) return;
                if (!response.ok) throw new Error('ログイン状態を確認できませんでした');
                setUser(await response.json());
                await loadExpenses();
            } catch {
                setError('データを取得できませんでした。再読み込みしてください');
            } finally {
                setChecking(false);
            }
        }
        void initialize();
    }, []);

    async function login() {
        setError('');
        try {
            const result = await auth.signIn.social({ provider: 'google', callbackURL: '/' });
            if (result.error) setError('Googleログインを開始できませんでした');
        } catch {
            setError('Googleログインを開始できませんでした');
        }
    }

    async function logout() {
        try {
            const result = await auth.signOut();
            if (result.error) throw new Error('ログアウトできませんでした');
            setUser(null);
            setExpenses([]);
            setAmount('');
            setMemo('');
            setError('');
        } catch {
            setError('ログアウトできませんでした');
        }
    }

    async function saveExpense(){
        setSaving(true);
        setError("");

        try{
            const response = await fetch("/api/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    memo
                })
            });

            if(!response.ok){
                throw new Error("支出を保存できませんでした");
            }

            setAmount("");
            setMemo("");
            await loadExpenses();
        } catch (error) {
            setError(error instanceof Error ? error.message : "エラーが発生しました");
        } finally {
            setSaving(false);
        }
    }


const cardSx = { p: { xs: 2.5, md: 3.5 }, borderRadius: 2, borderColor: 'divider' };

if (checking) return (
  <Stack direction="row" spacing={2} role="status" sx={{ p: 4, alignItems: "center" }}>
    <CircularProgress size={24} />
    <Typography color="text.secondary">ログイン状態を確認中…</Typography>
  </Stack>
);

if (!user) return (
  <Paper variant="outlined" sx={{ ...cardSx, maxWidth: 560, mx: 'auto', mt: { xs: 2, md: 6 } }}>
    <Stack spacing={3} sx={{ alignItems: "center", textAlign: 'center', py: 2 }}>
      <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
        <AccountBalanceWalletOutlinedIcon fontSize="large" />
      </Avatar>
      <Box>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }} gutterBottom>毎日の支出を、ひとつに。</Typography>
        <Typography color="text.secondary" variant="body2">Googleアカウントでログインして、自分の家計簿をはじめましょう。</Typography>
      </Box>
      <Button variant="contained" size="large" startIcon={<GoogleIcon />} onClick={() => void login()} disableElevation>
        Googleでログイン
      </Button>
      {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
    </Stack>
  </Paper>
);

return (
  <Stack spacing={3} sx={{ maxWidth: 1100, mx: 'auto', textAlign: 'left' }}>
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" } }}>
      <Box>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>家計簿</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>日々の支出を記録して、お金の流れを見えるように。</Typography>
      </Box>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: 'wrap', rowGap: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 16 }}>{user.name.slice(0, 1)}</Avatar>
        <Typography variant="body2">{user.name}さん</Typography>
        <Button size="small" color="inherit" startIcon={<LogoutIcon />} disabled={saving} onClick={() => void logout()}>ログアウト</Button>
      </Stack>
    </Stack>

    {error && <Alert severity="error">{error}</Alert>}

    <Paper variant="outlined" sx={cardSx}>
      <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="body2" color="text.secondary">記録した支出の合計</Typography>
          <Typography variant="h4" component="p" sx={{ fontWeight: 700, mt: 1, overflowWrap: 'anywhere' }}>
            ¥{expenses.reduce((total, expense) => total + expense.amount, 0).toLocaleString()}
          </Typography>
        </Box>
        <Chip label={`${expenses.length}件の記録`} color="primary" variant="outlined" />
      </Stack>
    </Paper>

    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 0.9fr) minmax(0, 1.1fr)' }, gap: 3, alignItems: 'start' }}>
      <Paper component="section" variant="outlined" sx={cardSx}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>支出を登録</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>使った金額とメモを入力してください。</Typography>
        <Stack component="form" spacing={2.5} onSubmit={(event) => { event.preventDefault(); void saveExpense(); }}>
          <TextField label="金額" type="number" required fullWidth value={amount} disabled={saving}
            onChange={(event) => setAmount(event.target.value)}
            slotProps={{ htmlInput: { min: 1, step: 1 }, input: { endAdornment: <InputAdornment position="end">円</InputAdornment> } }} />
          <TextField label="メモ" placeholder="例：昼ごはん、電車代" fullWidth multiline minRows={2} value={memo} disabled={saving}
            onChange={(event) => setMemo(event.target.value)} slotProps={{ htmlInput: { maxLength: 200 } }} helperText={`${memo.length} / 200文字`} />
          <Button type="submit" variant="contained" size="large" disabled={saving} disableElevation
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}>
            {saving ? '保存中…' : '支出を保存'}
          </Button>
        </Stack>
      </Paper>

      <Paper component="section" variant="outlined" sx={{ ...cardSx, minWidth: 0 }}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>支出一覧</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>これまでに記録した支出</Typography>
        {expenses.length === 0 ? (
          <Stack spacing={1.5} sx={{ alignItems: "center", py: 5, textAlign: 'center' }}>
            <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
            <Typography color="text.secondary">まだ支出の記録がありません</Typography>
            <Typography variant="body2" color="text.secondary">最初の支出を登録してみましょう。</Typography>
          </Stack>
        ) : (
          <Stack component="ul" divider={<Divider component="li" aria-hidden="true" />} sx={{ m: 0, p: 0, listStyle: 'none' }}>
            {expenses.map((expense) => (
              <Stack component="li" key={expense.id} direction="row" spacing={2} sx={{ justifyContent: "space-between", py: 2 }}>
                <Typography sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>{expense.memo || 'メモなし'}</Typography>
                <Typography sx={{ fontWeight: 700, flexShrink: 0 }}>{expense.amount.toLocaleString()}円</Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  </Stack>
);
}