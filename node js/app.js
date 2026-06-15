const http = require('http');
const fs = require('fs');
//create a file "student.json"

const server = http.createServer((req, res) => {

    let data = '';

    req.on('data', chunk => {
        data += chunk;
    });

    req.on('end', () => {

        let students = [];

        try {
            students = JSON.parse(fs.readFileSync('students.json'));
        } catch {
            students = [];
        }

        // GET
        if (req.method === 'GET') {
            res.end(JSON.stringify(students));
        }

        // POST
        else if (req.method === 'POST') {
            const student = JSON.parse(data);

            students.push(student);

            fs.writeFileSync(
                'students.json',
                JSON.stringify(students, null, 2)
            );

            res.end('Student Added');
        }

        // PUT
        else if (req.method === 'PUT') {

            const updated = JSON.parse(data);

            students = students.map(student => {
                if (Number(student.id) === Number(updated.id)) {
                    return updated;
                }
                return student;
            });

            fs.writeFileSync(
                'students.json',
                JSON.stringify(students, null, 2)
            );

            res.end('Student Updated');
        }

        // DELETE
        else if (req.method === 'DELETE') {
            const { id } = JSON.parse(data);

            students = students.filter(
                student => student.id !== id
            );

            fs.writeFileSync(
                'students.json',
                JSON.stringify(students, null, 2)
            );

            res.end('Student Deleted');
        }
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
