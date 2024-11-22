const promise1 = new Promise((resolve) => setTimeout(resolve, 2000));

const promise2 = Promise.reject(200);

Promise.all([promise1.catch(()=>{}), promise2.catch(()=>{})])
  .then(() => {
    console.log("已完成");
  })
  .catch(() => {
    console.log("已拒绝");
  });
