<table>
    <thead>
    <tr>
        <th>Nama</th>
        <th>NIM</th>
        <th>Kategori</th>
        <th>Tingkat</th>
        <th>Tanggal</th>
    </tr>
    </thead>
    <tbody>
    @foreach ($achievements as $item)
        <tr>
            <td>{{ $item->student->user->name ?? '-' }}</td>
            <td>{{ $item->student->nim ?? '-' }}</td>

            <td>{{ $item->category->name ?? '-' }}</td>

            <td>{{ $item->level }}</td>
            <td>{{ \Carbon\Carbon::parse($item->date)->format('d-m-Y') }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
