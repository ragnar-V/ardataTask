const SftpClient = require('ssh2-sftp-client');


//configuration for sftp connection
const config = {
    host: '192.168.1.254',
    port: '22',
    username: 'tester',
    password: 'password'
};

const sftp = new SftpClient();

async function testSFTP(){
    try {
        console.log('connecting to sftp server.....');
        await sftp.connect(config);
        console.log('connected successfully');
        
        // test 1: list files in remote directory
        console.log('\n--- listing files---');
        const fileList = await sftp.list('/sftp_files');
        console.log(fileList);

        // test 2: upload a file
        console.log('\n---uploading file---');
        const localFile = './test.txt';
        const remoteFile = '/sftp_files/uploaded_test.test';
        await sftp.put(localFile, remoteFile);
        console.log('file uploaded');

        // test 3: download a file
        console.log('\n---downloading file---');
        await sftp.get(remoteFile, './downloaded_test.txt');
        console.log('file downloaded');

        // test 4: delete a file
        console.log('\n---deleting file---');
        await sftp.mkdir('/sftp_files/new_folder', true);
        console.log('directory created');

        //test 5:  delete file
        console.log('\n---deleting file---');
        await sftp.delete('/sftp_files/uploaded_test.test');
        console.log('file deleted');

        
    } catch (error) {
        console.error('Error: ', error.message);
        
    } finally{
        await sftp.end();
        console.log('sftp connection closed');
    }

    //run the test 
  

    
}

  testSFTP();