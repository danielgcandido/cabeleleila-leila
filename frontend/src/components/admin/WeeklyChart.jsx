import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function WeeklyChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Agendamentos por Dia</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                name === 'count' ? `${value} agendamentos` : `R$ ${value.toFixed(2)}`,
                name === 'count' ? 'Agendamentos' : 'Receita',
              ]}
            />
            <Legend formatter={(value) => (value === 'count' ? 'Agendamentos' : 'Receita (R$)')} />
            <Bar dataKey="count" fill="hsl(330 81% 60%)" name="count" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
